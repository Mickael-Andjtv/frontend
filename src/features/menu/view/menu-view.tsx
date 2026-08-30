import MenuListComponent from "../components/menu-list";
import { MOCK_MENU_ITEMS } from "../mocks/menu.mock";
import AddMenuView from "./add-menu-view";

type Props = {
  isAdmin: boolean;
};

const MenuView = ({ isAdmin }: Props) => {
  return (
    <div className="p-4">
     <div className="flex justify-between m-2">
       <h1 className="text-xl font-bold">Menus</h1>
    {
      isAdmin && <AddMenuView />
    }
     </div>
      
      <MenuListComponent isAdmin={isAdmin} menuItems={MOCK_MENU_ITEMS} />
    </div>
  );
};

export default MenuView;
