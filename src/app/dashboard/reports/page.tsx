export default function ReportsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500 mt-2 max-w-md">
                Detailed financial reports and analytics will be available here soon.
            </p>
            <div className="mt-8 p-6 bg-white border border-[#EEEEEE] rounded-[4px] shadow-sm max-w-lg w-full">
                <p className="text-sm font-medium text-gray-700 mb-4">Available Reports (Coming Soon)</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm text-gray-600">
                        <span>Day Book</span>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">PDF / Excel</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm text-gray-600">
                        <span>Cash Flow Statement</span>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">PDF</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
