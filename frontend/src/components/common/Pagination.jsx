import Button from "./Button";
export default function Pagination({page, setPage, totalPages}) {
    const handlePrevious = () => {
        if (page > 1) {
        setPage(page - 1);
        }
    };
    const handleNext = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

  return (
    <div className="flex justify-center mt-6 space-x-4">
        <Button
            title="Previous"
            onClickFunction={handlePrevious}
            disabled={page === 1}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        />
        <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
            Page {page} of {totalPages}
        </span>
        <Button
            title="Next"
            onClickFunction={handleNext}
            disabled={page === totalPages}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        />
    </div>
  );
}
