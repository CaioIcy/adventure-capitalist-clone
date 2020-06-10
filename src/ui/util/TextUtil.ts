import { TextStyle } from 'pixi.js';

export class TextUtil {
    private static DEFAULT_TEXT_STYLE: object|TextStyle = {
        fill: 'white',
        dropShadow: true,
        dropShadowColor: 'black',
        dropShadowDistance: 2,
    };

    public static defaultStyle(): object|TextStyle {
        return TextUtil.DEFAULT_TEXT_STYLE;
    }

    public static createStyle(style: object|TextStyle) : object|TextStyle {
        return {
            ...TextUtil.DEFAULT_TEXT_STYLE,
            ...style,
        };
    }
}