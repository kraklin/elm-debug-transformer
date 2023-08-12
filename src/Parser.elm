port module Parser exposing (main)

import Debug exposing (toString)
import DebugParser
import Json.Encode exposing (Value)


port parse : (String -> msg) -> Sub msg


port sendParsed : String -> Cmd msg


main : Program String () Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    ()


init : String -> ( Model, Cmd Msg )
init message =
    case DebugParser.parse message of
        Ok parsed ->
            ( (), sendParsed ("parsed: " ++ toString parsed) )

        Err error ->
            ( (), sendParsed <| ("parsed error: " ++ error ++ "\n" ++ "original message: " ++ message) )


subscriptions : Model -> Sub Msg
subscriptions _ =
    parse TryParse


type Msg
    = TryParse String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    ( (), Cmd.none )
