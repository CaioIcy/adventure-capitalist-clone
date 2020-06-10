import { Container, Texture, Sprite } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import { Button } from '../component/Button';
import { BuyAmountToggle } from '../component/BuyAmountToggle';
import { BusinessCell } from '../component/BusinessCell';
import { HeaderContainer } from '../container/HeaderContainer';
import { Window } from '../../util/Window';

export class MainView extends Container {
    // TODO move from controller to here
    public header: HeaderContainer;
    public scroll: Scrollbox;
    public businessCells: BusinessCell[] = [];
    public buyAmountToggle: BuyAmountToggle;

    public constructor() {
        super();
    }
}