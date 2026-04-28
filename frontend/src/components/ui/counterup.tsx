import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface CounterUpProps {
  from: number;
  to: number;
  duration?: number;
}

export const CounterUp: React.FC<CounterUpProps> = ({
  from,
  to,
  duration = 2,
}) => {
  const count = useMotionValue(from);

  const rounded = useTransform(count, (latest) => {
    return Math.round(latest).toLocaleString("id-ID");
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(count, to, {
        duration: duration,
        ease: "easeOut",
      });
    }
  }, [isInView, count, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};
