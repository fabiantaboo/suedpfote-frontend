// FontAwesome Icons for Südpfote UI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart,
  faBagShopping,
  faCartShopping,
  faBasketShopping,
  faStar as faStarSolid,
  faGift,
  faTruck,
  faCheck,
  faCircleCheck,
  faLock,
  faLockOpen,
  faRocket,
  faWandMagicSparkles,
  faCreditCard,
  faHand,
  faTag,
  faXmark,
  faPlus,
  faMinus,
  faTrash,
  faSpinner,
  faCoins,
  faAward,
  faMedal
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

type IconProps = { className?: string };

export function CartIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faShoppingCart} className={className} />;
}

export function StarIcon({ className = "w-6 h-6", filled = false }: IconProps & { filled?: boolean }) {
  return <FontAwesomeIcon icon={filled ? faStarSolid : faStarRegular} className={className} />;
}

export function GiftIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faGift} className={className} />;
}

export function TruckIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faTruck} className={className} />;
}

export function CheckIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faCheck} className={className} />;
}

export function CheckCircleIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faCircleCheck} className={className} />;
}

export function LockIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faLock} className={className} />;
}

export function LockOpenIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faLockOpen} className={className} />;
}

export function RocketIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faRocket} className={className} />;
}

export function SparklesIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faWandMagicSparkles} className={className} />;
}

export function CreditCardIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faCreditCard} className={className} />;
}

export function HandIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faHand} className={className} />;
}

export function TagIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faTag} className={className} />;
}

// Additional commonly used icons
export function CloseIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faXmark} className={className} />;
}

export function PlusIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faPlus} className={className} />;
}

export function MinusIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faMinus} className={className} />;
}

export function TrashIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faTrash} className={className} />;
}

export function SpinnerIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faSpinner} className={className} spin />;
}

export function ShoppingBagIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faBagShopping} className={className} />;
}

export function CartShoppingIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faCartShopping} className={className} />;
}

export function BasketShoppingIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faBasketShopping} className={className} />;
}

export function CoinsIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faCoins} className={className} />;
}

export function AwardIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faAward} className={className} />;
}

export function MedalIcon({ className = "w-6 h-6" }: IconProps) {
  return <FontAwesomeIcon icon={faMedal} className={className} />;
}
