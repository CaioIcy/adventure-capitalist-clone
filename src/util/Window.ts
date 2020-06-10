export class Window {
    public static WIDTH: number = window.innerWidth;
    public static HEIGHT: number = window.innerHeight;

    public static scale(width: number, height: number): number {
        let scale = 1;
        if(width > Window.WIDTH) {
            scale = Window.WIDTH / width;
        } else if (height > Window.HEIGHT) {
            scale = Window.HEIGHT / height;
        }
        return scale;
    }
}
