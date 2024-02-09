
import { connect } from 'react-redux'
import { list_orders } from '../../redux/actions/orders'
import {
  get_items,
  get_total,
  get_item_total
} from "../../redux/actions/cart";
import { useEffect } from 'react';
import { Navigate } from 'react-router';
import DashboardLink from '../../components/dashboard/DashboardLink';
import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'
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
import { SearchIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom';
import { countries } from '../../helpers/fixedCountries';
import { update_user_profile } from '../../redux/actions/profile';
import Loader from 'react-loader-spinner';
const userNavigation = [
  { name: 'Salir', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DashboardProfile = ({
  list_orders,
  get_items,
  get_total,
  get_item_total,
  orders,
  isAuthenticated,
  user,
  update_user_profile,
  profile
}) => {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    get_items()
    get_total()
    get_item_total()
    list_orders()
  }, [])

  const [formData, setFormData] = useState({
    address_line_1: profile&&profile.address_line_1,
    address_line_2: profile&&profile.address_line_2,
    city: profile&&profile.city,
    state_province_region: profile&&profile.state_province_region,
    zipcode: '',
    phone: profile&&profile.phone,
    country_region: 'Ecuador'
  });

  const {
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    zipcode,
    phone,
    country_region
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true)
    update_user_profile(
      address_line_1,
      address_line_2,
      city,
      state_province_region,
      zipcode,
      phone,
      country_region
    );
    setLoading(false)
    window.scrollTo(0, 0);
  };

  if (!isAuthenticated)
    return <Navigate to="/" />

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link to="/">
                    <img
                      className="h-8 w-auto cursor-pointer"
                      src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
                      alt="Workflow"
                    />
                  </Link>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    <DashboardLink />
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">

              <Link
                to="/"
                className="mr-2 inline-flex items-center px-2.5 py-1.5  shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <img
                  className='h-4'
                  src="data:image/png;base64,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"
                  alt="" />
              </Link>

              <img
                className="h-8 w-auto"
                src="https://pngimg.com/d/alien_PNG12.png"
                alt="Workflow"
              />
              <span className=' font-medium font-semibold'>Alien Gamer</span>

            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                <DashboardLink />
              </nav>
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">

              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
                <form onSubmit={e => onSubmit(e)} className="max-w-3xl mx-auto">


                  <div className=" bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Información</h3>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Calle Principal 1:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="text"
                          name='address_line_1'
                          placeholder={`${profile.address_line_1}`}
                          onChange={e => onChange(e)}
                          value={address_line_1}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Calle secundaria 2:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="text"
                          name='address_line_2'
                          placeholder={`${profile.address_line_2}`}
                          onChange={e => onChange(e)}
                          value={address_line_2}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Canton
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="text"
                          name='city'
                          placeholder={`${profile.city}`}
                          onChange={e => onChange(e)}
                          value={city}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Provincia:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="text"
                          name='state_province_region'
                          placeholder={`${profile.state_province_region}`}
                          onChange={e => onChange(e)}
                          value={state_province_region}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>



                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Telefono:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="text"
                          name='phone'
                          placeholder={`${profile.phone}`}
                          onChange={e => onChange(e)}
                          value={phone}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Country
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <select
                            id='country_region' 
                            name='country_region'
                            onChange={e => onChange(e)}
                        >
                            <option value={country_region}>{profile.country_region}</option>
                            {
                                countries && countries.map((country, index) => (
                                    <option key={index} value={country.name}>{country.name}</option>
                                ))
                            }
                        </select>
                </div>
              </div> */}

                  {loading ? <button
                    className="inline-flex mt-4 float-right items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Loader
                      type="Oval"
                      width={20}
                      height={20}
                      color="#fff"
                    />
                  </button> : <button
                    type="submit"
                    className="inline-flex mt-4 float-right items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Guardar
                  </button>}

                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  orders: state.Orders.orders,
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
  profile: state.Profile.profile,
})

export default connect(mapStateToProps, {
  list_orders,
  get_items,
  get_total,
  get_item_total,
  update_user_profile
})(DashboardProfile)