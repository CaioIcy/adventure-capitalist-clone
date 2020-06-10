import { Container, Text, Texture, Sprite } from 'pixi.js';
import { Button } from '../component/Button';
import { Background } from '../component/Background';
import { Window } from '../../util/Window';
import { TextUtil } from '../util/TextUtil';

export class OfflineProfitPopupView extends Container {
    private background: Background;
    private timeOfflineLabel: Text;
    private profitLabel: Text;
    public collectAction: ()=>void;

    public constructor() {
        super();

        const width = 560;
        const height = Window.HEIGHT * 0.75;
        const pad = 48;

        this.x = Window.WIDTH * 0.5 - width * 0.5;
        this.y = Window.HEIGHT * 0.5 - height * 0.5;

        const overlay = new Sprite(Texture.WHITE);
        overlay.tint = 0x000000;
        overlay.alpha = 0.75;
        overlay.x = -Window.WIDTH*2;
        overlay.y = -Window.HEIGHT*2;
        overlay.width = Window.WIDTH*4;
        overlay.height = Window.HEIGHT*4;
        overlay.interactive = true;
        this.addChild(overlay);

        this.background = new Background({
            tint: 0x575757,
            lightTint: 0x575757,
            darkTint: 0x575757,
            borderTint: 0x171717,
            pad:4,
            width,
            height,
        });
        this.addChild(this.background);

        const titleLabel = new Text('WELCOME BACK!', TextUtil.createStyle({
            fontSize: 42,
            fill: '#AAAAFF',
        }));
        this.addChild(titleLabel);
        titleLabel.x = width * 0.5 - titleLabel.width*0.5;
        titleLabel.y = pad;

        const descriptionLabel = new Text('You were offline for:', TextUtil.defaultStyle());
        this.addChild(descriptionLabel);
        descriptionLabel.x = width * 0.5 - descriptionLabel.width*0.5;
        descriptionLabel.y = titleLabel.y + titleLabel.height + pad;

        this.timeOfflineLabel = new Text('XXhXXmXXs', TextUtil.defaultStyle());
        this.addChild(this.timeOfflineLabel);
        this.timeOfflineLabel.x = width * 0.5 - this.timeOfflineLabel.width*0.5;
        this.timeOfflineLabel.y = descriptionLabel.y + descriptionLabel.height + 4;

        const collectedLabel = new Text('You have earned:', TextUtil.defaultStyle());
        this.addChild(collectedLabel);
        collectedLabel.x = width * 0.5 - collectedLabel.width*0.5;
        collectedLabel.y = this.timeOfflineLabel.y + this.timeOfflineLabel.height + 2*pad;

        this.profitLabel = new Text('OOOOO', TextUtil.defaultStyle());
        this.addChild(this.profitLabel);
        this.profitLabel.x = width * 0.5 - this.profitLabel.width*0.5;
        this.profitLabel.y = collectedLabel.y + collectedLabel.height + 4;

        const collectButton = new Button('COLLECT', ()=>{
            if(this.collectAction) {
                this.collectAction();
            }
        });
        collectButton.x = width*0.5 - collectButton.width*0.5;
        collectButton.y = height - pad;
        this.addChild(collectButton);
    }

    public setTimeOffline(timeOfflineStr: string) {
        this.timeOfflineLabel.text = timeOfflineStr;
        this.timeOfflineLabel.x = this.background.width * 0.5 - this.timeOfflineLabel.width*0.5;
    }

    public setProfit(profitText: string): void {
        this.profitLabel.text = profitText;
        this.profitLabel.x = this.background.width * 0.5 - this.profitLabel.width*0.5;
    }
}
