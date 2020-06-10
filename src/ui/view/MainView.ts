import { Container } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import { BuyAmountToggle } from '../component/BuyAmountToggle';
import { BusinessCell } from '../component/BusinessCell';
import { HeaderContainer } from '../container/HeaderContainer';

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