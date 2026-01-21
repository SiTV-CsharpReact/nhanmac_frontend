import { useEffect, useState } from "react";

export function useResponsiveMenu<T>(
    menus: T[],
    containerRef: React.RefObject<HTMLElement>,
    measureRef: React.RefObject<HTMLElement>,
    options?: {
        gap?: number;
        moreWidth?: number;
        minWidth?: number;
    },
) {
    const { gap = 24, moreWidth = 100, minWidth = 80 } = options || {};

    const [visible, setVisible] = useState<T[]>(menus);
    const [overflow, setOverflow] = useState<T[]>([]);

    useEffect(() => {
        if (!containerRef.current || !measureRef.current) return;

        const calc = () => {
            const containerWidth = containerRef.current!.clientWidth;

            // ⛔ guard cực kỳ quan trọng
            if (containerWidth <= minWidth) {
                setVisible([]);
                setOverflow(menus);
                return;
            }

            const items = Array.from(
                measureRef.current!.children,
            ) as HTMLElement[];

            let used = 0;
            let visibleTmp: T[] = [];
            let overflowTmp: T[] = [];

            // ===== PASS 1: không có ...
            items.forEach((el, index) => {
                const w = el.offsetWidth + gap;
                if (used + w <= containerWidth) {
                    used += w;
                    visibleTmp.push(menus[index]);
                } else {
                    overflowTmp.push(menus[index]);
                }
            });

            // ===== PASS 2: có ...
            if (overflowTmp.length > 0) {
                used = 0;
                visibleTmp = [];
                overflowTmp = [];

                items.forEach((el, index) => {
                    const w = el.offsetWidth + gap;
                    if (used + w <= containerWidth - moreWidth) {
                        used += w;
                        visibleTmp.push(menus[index]);
                    } else {
                        overflowTmp.push(menus[index]);
                    }
                });
            }

            setVisible(visibleTmp);
            setOverflow(overflowTmp);
        };

        // chạy lần đầu
        calc();

        const ro = new ResizeObserver(() => {
            requestAnimationFrame(calc);
        });

        ro.observe(containerRef.current);

        return () => ro.disconnect();
    }, [menus, containerRef, measureRef, gap, moreWidth, minWidth]);

    return { visible, overflow };
}
