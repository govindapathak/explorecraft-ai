
import { Button } from '@/components/ui/button';

interface StartNavigationButtonProps {
  itemsCount: number;
}

const StartNavigationButton = ({ itemsCount }: StartNavigationButtonProps) => {
  if (itemsCount === 0) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Button className="w-full sm:w-auto">
        Start Navigation
      </Button>
    </div>
  );
};

export default StartNavigationButton;
