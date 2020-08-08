import PreviewSection from './PreviewSection';
import PackageDetail from './PackageDetail';
import PackageCategoryDetails from './PackageCategoryDetails';
import PackageSummary from './PackageSummary';
import ReserveConfirmationModal from './ReserveConfirmationModal';
import EndpointsMap from './EndpointsMap';

export {
  PackageDetail,
  PackageCategoryDetails,
  EndpointsMap,
  PackageSummary,
  PreviewSection,
  ReserveConfirmationModal,
};

export const generateTagStyle = () => {
  const r = Math.floor(Math.random() * 144);
  const g = Math.floor(Math.random() * 144);
  const b = Math.floor(Math.random() * 144);
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return {
    padding: '6px',
    borderRadius: '10px',
    backgroundColor: `rgb(${r},${g},${b})`,
    color: hsp > 127.5 ? '#000' : '#fff',
  };
};
