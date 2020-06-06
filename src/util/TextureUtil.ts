import { Texture, BaseTexture, resources } from 'pixi.js';

export class TextureUtil {
    public static createRandomTexture() : Texture {
        const color = (Math.random()*0xFFFFFF<<0);
        let style = '#' + color.toString(16);
        return TextureUtil.createTexture(style);
    }

    public static createTexture(fillStyle: string) : Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext('2d');
        context.fillStyle = fillStyle;
        context.fillRect(0, 0, 16, 16);
        return new Texture(new BaseTexture(new resources.CanvasResource(canvas)));
    }
}
