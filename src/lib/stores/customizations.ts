import { get, writable } from 'svelte/store';

export const customizationSvgDefinitions = writable({});

export function getCustomizationId(type: string, name: string) {
    return `${type}-${name}`
}

export function loadCustomizationSvg(type: string, name: string) {
    const id = getCustomizationId(type, name);
    const loadedDefinitions = get(customizationSvgDefinitions);

    if (!(id in loadedDefinitions)) {
        const mediaURL = `https://media.battlesnake.com/snakes/${type}s/${name}.svg`;
        fetch(mediaURL)
            .then((response) => response.text())
            .then((rawSVG) => {
                // We want to strip the outer <svg> tag so we can embed as symbol
                const tempTemplate = document.createElement('template');
                tempTemplate.innerHTML = rawSVG.trim();
                customizationSvgDefinitions.update($current => {
                    $current[id] = tempTemplate.content.firstChild.innerHTML;
                    console.log('loaded ' + id);
                    return $current;
                });
            });
    }
}
