import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "html": {
        "height": "100%",
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "body": {
        "height": "100%",
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "map": {
        "height": "100%",
        "float": "right"
    },
    "panel": {
        "height": "100%",
        "backgroundColor": "#000",
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 30,
        "fontFamily": "'Roboto', 'sans-serif'",
        "lineHeight": 30
    },
    "panel h2": {
        "color": "grey"
    },
    "panel input": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "float": "left",
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "border": "none"
    },
    "panel submit": {
        "color": "white",
        "background": "linear-gradient(to bottom, #0062ad 1%, #003c75 100%)"
    },
    "panel locations": {
        "color": "grey",
        "float": "left"
    },
    "locations ul": {
        "color": "grey",
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "fontSize": 28
    },
    "list-item:hover": {
        "color": "white",
        "cursor": "pointer"
    },
    "list-item:active": {
        "color": "blue"
    },
    "collapsed": {
        "display": "none"
    },
    "row-main": {
        "overflowX": "hidden"
    },
    "hamburger": {
        "fontSize": 32,
        "textDecoration": "none",
        "color": "white"
    },
    "header": {
        "background": "linear-gradient(to bottom, #0062ad 1%, #003c75 100%)"
    }
});