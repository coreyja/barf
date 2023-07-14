import Mousestrap from 'mousetrap';

type Options = {
    key: string,
    f: () => void
}

export function keybind(node, options: Options) {
    const mousetrap = new Mousestrap(window.document);
    mousetrap.bind([options.key], options.f);

    return {
        destroy() {
            mousetrap.reset()
        }
    }
}
