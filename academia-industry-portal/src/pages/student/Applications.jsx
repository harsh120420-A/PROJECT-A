import StudentLayout from "../../layouts/StudentLayout";
import { applications } from "../../data/applications";

function Applications() {
    return (
        <StudentLayout>

            <div className="p-8">

                <p className="text-sm text-blue-600 font-medium">
                    APPLICATIONS
                </p>

                <h1 className="text-3xl font-bold mt-2">
                    My Applications
                </h1>

                <p className="text-slate-500 mt-2">
                    Track your internship and job applications.
                </p>

                <div className="mt-8 bg-white border rounded-2xl overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4 text-sm">
                                    Opportunity
                                </th>

                                <th className="text-left p-4 text-sm">
                                    Company
                                </th>

                                <th className="text-left p-4 text-sm">
                                    Applied
                                </th>

                                <th className="text-left p-4 text-sm">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {applications.map((application) => (
                                <tr
                                    key={application.id}
                                    className="border-t"
                                >

                                    <td className="p-4 font-medium">
                                        {application.title}
                                    </td>

                                    <td className="p-4 text-slate-500">
                                        {application.company}
                                    </td>

                                    <td className="p-4 text-slate-500">
                                        {application.appliedDate}
                                    </td>

                                    <td className="p-4">

                                        <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600">
                                            {application.status}
                                        </span>

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </StudentLayout>
    );
}

export default Applications;