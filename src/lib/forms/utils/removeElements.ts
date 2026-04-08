
export default function removeElementForm(evt: MouseEvent) {
    const target = evt.target as HTMLButtonElement;
    const parentDiv = target?.closest(".container-components");

    if (!parentDiv) return;

    parentDiv.remove();
}
