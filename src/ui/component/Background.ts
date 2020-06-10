import { Container, Text, Sprite, Texture } from 'pixi.js';

export class Background extends Container {
    // TODO shine?
    public constructor(options: any) {
        super();

        let { width, height, pad, tint, borderTint, lightTint, darkTint } = options;
        pad = pad || 0;
        borderTint = borderTint || tint;
        lightTint = lightTint || 0xFFFFFF;
        darkTint = darkTint || 0x000000;

        const paddedWidth = width - (2*pad);
        const paddedHeight = height - (2*pad);

        const border = new Sprite(Texture.WHITE);
        border.width = width;
        border.height = height;
        border.tint = borderTint;
        this.addChild(border);

        const mainBackground = new Sprite(Texture.WHITE);
        mainBackground.x = pad;
        mainBackground.y = pad;
        mainBackground.width = paddedWidth;
        mainBackground.height = paddedHeight;
        mainBackground.tint = tint;
        this.addChild(mainBackground);

        const lightBackground = new Sprite(Texture.WHITE);
        lightBackground.x = pad*3;
        lightBackground.y = pad;
        lightBackground.width = paddedWidth - (4 * pad);
        lightBackground.height = paddedHeight/2;
        lightBackground.tint = lightTint;
        lightBackground.alpha = 28/255;
        this.addChild(lightBackground);

        const darkBackground = new Sprite(Texture.WHITE);
        darkBackground.x = pad*3;
        darkBackground.y = pad + paddedHeight/2;
        darkBackground.width = paddedWidth - (4 * pad);
        darkBackground.height = paddedHeight/2;
        darkBackground.tint = darkTint;
        darkBackground.alpha = 10/255;
        this.addChild(darkBackground);
    }
}