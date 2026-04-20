import { useEffect, useRef, useState } from "react";
import Tab from "./Tab";
import Cursor from "./Cursor";

interface TabType {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export default function SlideTabs({
  tabs,
  selected,
  onTabChange,
}: {
  tabs: TabType[];
  selected: number;
  onTabChange: (index: number) => void;
}) {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const selectedTab = tabsRef.current[selected];
    if (selectedTab) {
      const { width } = selectedTab.getBoundingClientRect();
      setPosition({ left: selectedTab.offsetLeft, width, opacity: 1 });
    }
  }, [selected]);

  return (
    <div className="relative mx-auto flex w-full rounded-xl bg-muted p-1 mb-8">
      {tabs.map((tab, i) => (
        <Tab
          key={tab.value}
          ref={(el: HTMLButtonElement | null) => {
            tabsRef.current[i] = el;
          }}
          isActive={selected === i}
          icon={tab.icon}
          onClick={() => onTabChange(i)}
          setPosition={setPosition}
        >
          {tab.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </div>
  );
}
