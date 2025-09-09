import FieldPalette from "./FieldPalette";

export default function FormBuilder() {
    return(
     <>
       <div className="form-builder grid grid-cols-12 gap-4 h-[calc(100vh-6rem)] p-4 bg-gray-50">
            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <FieldPalette />
            </div>

            <div className="col-span-8 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Form Builder</h2>
            </div>

            <div className="col-span-2 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Field Settings</h2>
            </div>
        </div>
     </>   
    )
}