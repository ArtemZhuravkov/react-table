export const getHeatmapStyle = (cellAmount: number, maxAmount: number) => {
    const percentage = maxAmount > 0 ? (cellAmount / maxAmount) * 100 : 0;
    return { backgroundColor: `rgba(255, 0, 0, ${percentage / 100})` };
  };