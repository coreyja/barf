import Mousestrap from 'mousetrap';


export function keybind(node, options) {
    const mousetrap = new Mousestrap(window.document);
    mousetrap.bind(options[0], options[1]);

    return {
        destroy() {
            mousetrap.reset()
        }
    }
}
