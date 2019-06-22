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


type Tree a
    = Leaf a
    | Node (Tree a) (Tree a)


type alias Model =
    { array : Array Int
    , set : Set String
    , dict : Dict Int String
    , dictWithTuples : Dict ( Int, String, Int ) String
    , bools : ( Bool, Bool )
    , binaryTree : Tree CustomType
    , custom : CustomType
    , tuple : ( Int, Int )
    , triplet : ( Int, String, Int )
    , nonEmptyList : ( Int, List Int )
    , complexTuple : ( Int, ( String, ( String, Int ) ) )
    , int : Int
    , unit : ()
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
      , dictWithTuples = Dict.fromList [ ( ( 0, "b", 1 ), "a" ), ( ( 0, "c", 1 ), "b" ), ( ( 4, "d", 1 ), "String longer than one char" ) ]
      , custom = Complex [ ( 1, Some "text" 1 ), ( 2, Recursive (Complex []) ), ( 3, None ) ]
      , tuple = ( 1, 2 )
      , triplet = ( 1, "b", 1 )
      , complexTuple = ( 1, ( "longer string", ( "much longer string", 1 ) ) )
      , int = 123
      , string = "Some string"
      , list = [ Nothing, Just [ "String" ], Nothing, Nothing ]
      , listSingleton = [ "Singleton" ]
      , listOfLists = [ [ [ "a", "b" ], [ "c", "d" ] ], [ [ "e", "f" ], [ "g", "h" ] ] ]
      , nonEmptyList = ( 1, [] )
      , function = String.fromInt
      , binaryTree = Node (Node (Leaf None) (Leaf None)) (Node (Leaf None) (Leaf None))
      , unit = ()
      }
    , Cmd.none
    )



---- UPDATE ----


type Msg
    = DebugOutputClicked


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        _ =
            Debug.log "Debug: " model

        -- { number = "123", type_ = Just (Just 123) }
    in
    ( model, Cmd.none )



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
