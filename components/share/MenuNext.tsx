import { fetchMenus } from "@/modules/client/menuApi";
import { headers } from "next/headers";
import MenuClient from "./MenuClient";

export default async function MenuServer() {
    const res = await fetchMenus();
    const sorted = res.Data.sort((a, b) => a.ordering - b.ordering);
    const menus = buildTree(sorted);
    //LẤY PATHNAME Ở SERVER
    const headersList = headers();
    const pathname =
        headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
    return <MenuClient menus={menus} pathname={pathname}/>;
}

const buildTree = (items: any[]) => {
    const map: any = {};
    const roots: any[] = [];

    items.forEach((item) => {
        item.children = [];
        map[item.id] = item;
    });

    items.forEach((item) => {
        if (item.parent && map[item.parent]) {
            map[item.parent].children.push(item);
        } else {
            roots.push(item);
        }
    });

    return roots;
};
