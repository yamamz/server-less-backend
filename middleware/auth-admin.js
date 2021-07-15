import Swal from "sweetalert2";
export default async function ({ $auth, redirect }) {
    let user = $auth.state.user
    if (user.role === 'admin') {

    } else {
        redirect('/')
        Swal.fire("Opps!", "You don't have permission to register a user", "error");
    }

}