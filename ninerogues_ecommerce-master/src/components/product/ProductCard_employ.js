import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import { delete_product } from "../../redux/actions/products"

const ProductCard_employ = ({ product, delete_product }) => {

  const question = () => {
    Swal.fire({
      icon: "warning",
      title: "Vas a eliminar este producto ¿Estas seguro?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await delete_product(product.id)
        Toast.fire({
          icon: "success",
          title: "Producto eliminado!"
        });
        setTimeout(() => {
          window.location.href = '/dashboard_employee_product';
        }, 1000);
      }
    });
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });


  return (
    <>
      <div key={product.id} className="group relative mx-2">

        <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-36 lg:w-36 lg:aspect-none">
          <img
            src={product.photo}
            alt=""
            className="w-full h-full object-center object-cover lg:w-full lg:h-full"
          />
        </div>

        <div className="mt-4  mb-2 ml-1 justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <div className="cursor-pointer">

                {product.name}
              </div>
            </h3>
          </div>
          <p className="text-sm font-medium text-gray-900">${product.price}</p>
        </div>



      </div>
      <div className="flex space-x-4 mb-4 ml-3 font-semibold ">
        <div className="p-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 cursor-pointer" onClick={question}>Eliminar</div>
        <Link to={`/dashboard_employee_product/${product.id}`}>
        <div className="p-1 text-xs rounded-md bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer">Actulizar</div>
        </Link>

      </div>
    </>

  )
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {
  delete_product
})(ProductCard_employ)
