import { Container, Text, Sprite, Texture } from 'pixi.js';
import { TextureUtil } from '../../util/TextureUtil';

export interface ProgressBarOptions {
	width: number;
	height: number;
}

export class ProgressBar extends Container {
    private progress: Sprite;
    private text: Text;

    private pad: number = 2;

    public constructor(options: ProgressBarOptions) {
        super();

        const { width, height } = options;

        this.width = width;
        this.height = height;

        const bg = new Sprite(Texture.WHITE);
        bg.tint = 0x000000;
        bg.width = width;
        bg.height = height;
        this.addChild(bg);

        this.progress = new Sprite(TextureUtil.createTexture('#00ff00'));
        this.progress.x = this.pad;
        this.progress.y = this.pad;
        this.progress.height = height-this.pad*2;
        this.addChild(this.progress);
        this.setProgress(0.33);

        this.text = new Text('01/25', {
            fill: 'white',
        });
        this.addChild(this.text);
    }

    public setProgress(progress: number): void {
        this.progress.width = progress * (this.width - this.pad*2);
    }

    public setText(text: string): void {
        this.text.text = text;
    }
}
