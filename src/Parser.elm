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
    case value of
        Plain plainValue ->
            case plainValue of
                _ ->
                    Json.Encode.object [ ( "type", Json.Encode.string "Boolean" ), ( "value", Json.Encode.bool True ) ]

        _ ->
            Json.Encode.object [ ( "type", Json.Encode.string "Boolean" ), ( "value", Json.Encode.bool False ) ]


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
