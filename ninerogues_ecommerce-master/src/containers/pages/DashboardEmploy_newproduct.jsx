import { connect } from 'react-redux'
import React from 'react';
import { list_orders } from '../../redux/actions/orders'
import {
  get_items,
  get_total,
  get_item_total
} from "../../redux/actions/cart";
import { post_product } from '../../redux/actions/products'
import { useEffect } from 'react';
import { Navigate } from 'react-router';
import DashboardLink_empl from '../../components/dashboard/DashboardLink_empl';
import { get_categories } from '../../redux/actions/categories'
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

const DashboardEmploy_newproduct = ({
  list_orders,
  get_items,
  get_total,
  get_item_total,
  orders,
  isAuthenticated,
  user,
  update_user_profile,
  profile,
  categories,
  get_categories,
  post_product
}) => {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    get_items()
    get_categories()
    get_total()
    get_item_total()
    list_orders()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    photo: null,
  });

  const {
    name,
    description,
    price,
    quantity,
    category,
    photo
  } = formData;

  const onChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        [e.target.name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true)
     await post_product(
       name,
      photo,
      description,
      price,
      category,
      quantity,
      0
    );
    setLoading(false)
    setTimeout(() => {
      window.location.href = '/dashboard_employee_product';
    }, 1000);
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
                    <DashboardLink_empl />
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
                <DashboardLink_empl />
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
                <form className="w-full flex md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    buscar
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      id="search-field"
                      className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                      placeholder="Search"
                      type="search"
                      name="search"
                    />
                  </div>
                </form>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
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
                <form onSubmit={e => onSubmit(e)} className="max-w-3xl mx-auto" encType="multipart/form-data">


                  <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Nuevo producto</h3>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Nombre:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="text"
                          name='name'
                          placeholder="Nombre"
                          onChange={e => onChange(e)}
                          value={name}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Descripción:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2 h-12 bg-red-200">
                      <div className="max-w-lg h-full flex rounded-md shadow-sm bg-green-200">

                        <input
                          type="text"
                          name='description'
                          placeholder="Descripción"
                          onChange={e => onChange(e)}
                          value={description}
                          className="flex-1 block w-full h-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Precio:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="number"
                          name='price'
                          placeholder="Precio"
                          onChange={e => onChange(e)}
                          value={price}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Cantidad:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="number"
                          name='quantity'
                          placeholder="cantidad"
                          onChange={e => onChange(e)}
                          value={quantity}
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Categoria:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        {
                          categories && categories !== null && categories !== undefined && (
                            <select onChange={e => onChange(e)} name="category" className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500">
                              {categories.map((category) => (
                                <React.Fragment key={category.id}>
                                  <option value={category.id}>{category.name}</option>
                                  {category.sub_categories.length > 0 &&
                                    category.sub_categories.map((sub_category) => (
                                      <option key={sub_category.id} value={sub_category.id}>
                                        {sub_category.name}
                                      </option>
                                    ))}
                                </React.Fragment>
                              ))}
                            </select>
                          )
                        }
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Imagen:
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">

                        <input
                          type="file"
                          name='photo'
                          onChange={onChange}
                          accept="image/png, .jpeg, .jpg, image/gif"
                          className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                        />
                      </div>
                    </div>
                  </div>
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
  categories: state.Categories.categories,
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
  profile: state.Profile.profile,
})

export default connect(mapStateToProps, {
  list_orders,
  get_categories,
  get_items,
  get_total,
  get_item_total,
  post_product,
  update_user_profile
})(DashboardEmploy_newproduct)