import { Container, Text, Sprite, Texture } from 'pixi.js';
import { TextUtil } from '../util/TextUtil';

export interface ProgressBarOptions {
	width: number;
	height: number;
}

export class ProgressBar extends Container {
    private progress: Sprite;
    private progressShine: Sprite;
    private label: Text;

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

        this.progress = new Sprite(Texture.WHITE);
        this.progress.tint = 0x9cd651;
        this.progress.x = this.pad;
        this.progress.y = this.pad;
        this.progress.height = height-this.pad*2;
        this.addChild(this.progress);

        this.progressShine = new Sprite(Texture.WHITE);
        this.progressShine.tint = 0xFFFFFF;
        this.progressShine.alpha = 0.2;
        this.progressShine.x = this.pad;
        this.progressShine.y = this.pad;
        this.progressShine.height = this.progress.height*0.33;
        this.addChild(this.progressShine);
        this.setProgress(0.0);

        this.label = new Text('', TextUtil.defaultStyle());
        this.addChild(this.label);
        this.setText('OOOO');
    }

    public setProgress(progress: number): void {
        const width = progress * (this.width - this.pad*2);
        this.progress.width = width;
        this.progressShine.width = width;
    }

    public setText(text: string): void {
        this.label.text = text;
        this.label.x = this.width * 0.5 - this.label.width * 0.5;
        this.label.y = this.height * 0.5 - this.label.height * 0.5;
    }
}
