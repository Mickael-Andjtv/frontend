import MenuListComponent from "../components/menu-list";
import { MOCK_MENU_ITEMS } from "../mocks/menu.mock";

type Props = {
  isAdmin: boolean;
};

const MenuView = ({ isAdmin }: Props) => {
  return (
    <div className="p-4">
      <MenuListComponent isAdmin={isAdmin} menuItems={MOCK_MENU_ITEMS} />
    </div>
  );
};

export default MenuView;
