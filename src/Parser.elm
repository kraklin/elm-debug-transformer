port module Parser exposing (main)

import Debug exposing (toString)
import DebugParser
import DebugParser.ElmValue exposing (ElmValue(..), PlainValue(..))
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

                _ ->
                    Json.Encode.object [ ( "type", Json.Encode.string "Missing" ), ( "value", Json.Encode.string "missing..." ) ]

        _ ->
            Json.Encode.object [ ( "type", Json.Encode.string "Missing" ), ( "value", Json.Encode.string "missing..." ) ]


init : String -> ( Model, Cmd Msg )
init message =
    case DebugParser.parse message of
        Ok { tag, value } ->
            ( (), sendParsed (Json.Encode.object [ ( "type", Json.Encode.string "ElmDebug" ), ( "name", Json.Encode.string tag ), ( "value", encodeDebugValue value ) ]) )

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
