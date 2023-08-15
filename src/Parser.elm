port module Parser exposing (main)

import Debug exposing (toString)
import DebugParser
import DebugParser.ElmValue exposing (ElmValue(..), ExpandableValue(..), PlainValue(..), SequenceType(..))
import Json.Encode exposing (Value)


port parse : (String -> msg) -> Sub msg


port sendParsed : Value -> Cmd msg


main : Program String () Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    ()


encodeDebugValue : ElmValue -> Value
encodeDebugValue value =
    let
        encodeType typeName valueEncoder =
            Json.Encode.object [ ( "type", Json.Encode.string typeName ), ( "value", valueEncoder ) ]
    in
    case value of
        Plain plainValue ->
            case plainValue of
                ElmBool bool ->
                    encodeType "Boolean" <| Json.Encode.bool bool

                ElmNumber number ->
                    if isNaN number then
                        encodeType "Number" <| Json.Encode.string "NaN"

                    else if isInfinite number && number > 0 then
                        encodeType "Number" <| Json.Encode.string "Infinity"

                    else if isInfinite number && number < 0 then
                        encodeType "Number" <| Json.Encode.string "-Infinity"

                    else
                        encodeType "Number" <| Json.Encode.float number

                ElmString string ->
                    encodeType "String" <| Json.Encode.string string

                ElmFile name ->
                    encodeType "File" <| Json.Encode.string name

                ElmBytes size ->
                    encodeType "Bytes" <| Json.Encode.int size

                ElmFunction ->
                    Json.Encode.object [ ( "type", Json.Encode.string "Function" ) ]

                ElmInternals ->
                    Json.Encode.object [ ( "type", Json.Encode.string "Internals" ) ]

                ElmUnit ->
                    Json.Encode.object [ ( "type", Json.Encode.string "Unit" ) ]

                ElmChar char ->
                    Json.Encode.object [ ( "type", Json.Encode.string "String" ), ( "value", Json.Encode.string <| String.fromChar char ) ]

        Expandable _ expandable ->
            case expandable of
                ElmSequence SeqTuple values ->
                    encodeType "Tuple" <| Json.Encode.list encodeDebugValue values

                ElmSequence SeqList values ->
                    encodeType "List" <| Json.Encode.list encodeDebugValue values

                ElmSequence SeqSet values ->
                    encodeType "Set" <| Json.Encode.list encodeDebugValue values

                ElmSequence SeqArray values ->
                    encodeType "Array" <| Json.Encode.list encodeDebugValue values

                ElmDict values ->
                    values
                        |> Json.Encode.list (\( k, v ) -> Json.Encode.object [ ( "key", encodeDebugValue k ), ( "value", encodeDebugValue v ) ])
                        |> encodeType "Dict"

                _ ->
                    Json.Encode.object [ ( "type", Json.Encode.string "expandable" ), ( "value", Json.Encode.string "missing..." ) ]


config : DebugParser.Config Json.Encode.Value
config =
    let
        encodeType typeName valueEncoder =
            Json.Encode.object [ ( "type", Json.Encode.string typeName ), ( "value", valueEncoder ) ]
    in
    { bool = encodeType "Boolean" << Json.Encode.bool
    , string = encodeType "String" << Json.Encode.string
    , number =
        \number ->
            if isNaN number then
                encodeType "Number" <| Json.Encode.string "NaN"

            else if isInfinite number && number > 0 then
                encodeType "Number" <| Json.Encode.string "Infinity"

            else if isInfinite number && number < 0 then
                encodeType "Number" <| Json.Encode.string "-Infinity"

            else
                encodeType "Number" <| Json.Encode.float number
    , file =
        encodeType "File" << Json.Encode.string
    , bytes =
        encodeType "Bytes" << Json.Encode.int
    , function =
        Json.Encode.object [ ( "type", Json.Encode.string "Function" ) ]
    , internals =
        Json.Encode.object [ ( "type", Json.Encode.string "Internals" ) ]
    , unit =
        Json.Encode.object [ ( "type", Json.Encode.string "Unit" ) ]
    , char =
        \char ->
            Json.Encode.object [ ( "type", Json.Encode.string "String" ), ( "value", Json.Encode.string <| String.fromChar char ) ]
    , array =
        encodeType "Array" << Json.Encode.list identity
    , list =
        encodeType "List" << Json.Encode.list identity
    , set =
        encodeType "Set" << Json.Encode.list identity
    , tuple =
        encodeType "Tuple" << Json.Encode.list identity
    , dict =
        \values ->
            values
                |> Json.Encode.list (\( k, v ) -> Json.Encode.object [ ( "key", k ), ( "value", v ) ])
                |> encodeType "Dict"
    , record =
        \values ->
            values
                |> Json.Encode.object
                |> encodeType "Record"
    , customType =
        \name values ->
            if List.isEmpty values then
                Json.Encode.object <| [ ( "type", Json.Encode.string "Type" ), ( "name", Json.Encode.string name ) ]

            else
                Json.Encode.object <|
                    [ ( "type", Json.Encode.string "Custom" )
                    , ( "name", Json.Encode.string name )
                    , ( "value", Json.Encode.list identity values )
                    ]
    }


init : String -> ( Model, Cmd Msg )
init message =
    case DebugParser.parse config message of
        Ok { tag, value } ->
            ( (), sendParsed (Json.Encode.object [ ( "type", Json.Encode.string "ElmDebug" ), ( "name", Json.Encode.string tag ), ( "value", value ) ]) )

        Err error ->
            ( (), sendParsed (Json.Encode.object [ ( "error", Json.Encode.string error ) ]) )


subscriptions : Model -> Sub Msg
subscriptions _ =
    parse TryParse


type Msg
    = TryParse String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    ( (), Cmd.none )
