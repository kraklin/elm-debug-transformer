module Main exposing (Model, Msg(..), init, main, update, view)

import Array exposing (Array)
import Browser
import Dict exposing (Dict)
import Html exposing (Html, div, h1, img, text)
import Html.Attributes exposing (src)
import Html.Events exposing (onClick)
import Set exposing (Set)



---- MODEL ----


type CustomType
    = None
    | Some String Int
    | Recursive CustomType
    | Complex (List ( Int, CustomType ))


type alias Model =
    { array : Array Int
    , set : Set String
    , dict : Dict Int String
    , bools : ( Bool, Bool )
    , custom : CustomType
    , tuple : ( Int, Int )
    , complexTuple : ( Int, ( String, ( String, Int ) ) )
    , int : Int
    , string : String
    , list : List (Maybe (List String))
    , listSingleton : List String
    , listOfLists : List (List (List String))
    , function : Int -> String
    }


init : ( Model, Cmd Msg )
init =
    ( { array = Array.fromList [ 1, 2, 3, 4, 5678, 3464637, 893145, -29 ]
      , set = Set.fromList [ "a", "b", "Some really long string with some nonsense" ]
      , bools = ( True, False )
      , dict = Dict.fromList [ ( 1, "a" ), ( 2, "b" ), ( 234, "String longer than one char" ) ]
      , custom = Complex [ ( 1, Some "text" 1 ), ( 2, Recursive (Complex []) ), ( 3, None ) ]
      , tuple = ( 1, 2 )
      , complexTuple = ( 1, ( "longer string", ( "much longer string", 1 ) ) )
      , int = 123
      , string = "Some string"
      , list = [ Nothing, Just [ "String" ], Nothing, Nothing ]
      , listSingleton = [ "Singleton" ]
      , listOfLists = [ [ [ "a", "b" ], [ "c", "d" ] ], [ [ "e", "f" ], [ "g", "h" ] ] ]
      , function = String.fromInt
      }
    , Cmd.none
    )



---- UPDATE ----


type Msg
    = DebugOutputClicked


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( Debug.log "Model" model, Cmd.none )



---- VIEW ----


view : Model -> Html Msg
view model =
    div []
        [ img [ src "/logo.svg" ] []
        , h1 [] [ text "Your Elm App is working!" ]
        , Html.button [ onClick DebugOutputClicked ] [ Html.text "Debug Model to console" ]
        ]



---- PROGRAM ----


main : Program () Model Msg
main =
    Browser.element
        { view = view
        , init = \_ -> init
        , update = update
        , subscriptions = always Sub.none
        }
