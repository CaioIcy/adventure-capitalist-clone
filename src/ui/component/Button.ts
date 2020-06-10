import { Container, Text } from 'pixi.js';
import { Background } from './Background';
import { TextUtil } from '../util/TextUtil';

export class Button extends Container {
    private text: Text;

    public constructor(label: string, action: () => void) {
        super();

        this.text = new Text(`[${label}]`, TextUtil.defaultStyle());

        const background = new Background({
            width: this.text.width,
            height: this.text.height,
        });
        this.addChild(background);

        this.addChild(this.text);

        this.interactive = true;
        this.buttonMode = true;

        this.on('pointerdown', action);
    }
}
