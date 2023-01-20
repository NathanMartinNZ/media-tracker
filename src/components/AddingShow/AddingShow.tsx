import styles from "./AddingShow.module.css"

const AddingShow = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-700 opacity-90">
      <div className={`${styles.loader} mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear`}></div>
      <h2 className="text-center text-xl font-semibold text-white">
        Adding show...
      </h2>
      <p className="w-1/3 text-center text-white">This may take a few seconds, please don't close this page.</p>
    </div>
  );
};

export default AddingShow;
