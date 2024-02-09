import { Link } from "react-router-dom"
import {
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    MenuAlt2Icon,
    UsersIcon,
    XIcon,
    PaperClipIcon
} from '@heroicons/react/outline'
import { CreditCardIcon, SearchIcon, UserIcon } from '@heroicons/react/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const DashboardLink_empl = () => {
    return (
        <>
            <Link
                to="/dashboard_employee_product"
                className={classNames('text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                )}
            >
                <CalendarIcon
                    className={classNames(
                        'mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500',
                    )}
                    aria-hidden="true"
                />
                Productos
            </Link>

            <Link
                to="/dashboard_employee"
                className={classNames('text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                )}
            >
                <CreditCardIcon
                    className={classNames(
                        'mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500',
                    )}
                    aria-hidden="true"
                />
                Ordenes
            </Link>
        </>
    )
}

export default DashboardLink_empl