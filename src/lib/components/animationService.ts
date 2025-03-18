import type { IAnimationService } from "@lib/utils/dial-drop-zone/interfaces";

export class AnimationService {
  static animateRemove(
    element: HTMLElement,
    animationName: IAnimationService = "fadeOut"
  ) {
    element.style.animation = `${animationName} 0.3s ease-out forwards`;
    element.style.pointerEvents = "none";

    return new Promise<void>((resolve) => {
      element.addEventListener(
        "animationend",
        () => {
          element.remove();
          resolve();
        },
        { once: true }
      );
    });
  }
}