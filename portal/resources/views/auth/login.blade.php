<form method="POST" action="/admin/login">
    @csrf

    <input name="email" placeholder="Email" type="text">

    <input name="password" placeholder="Password" type="password">

    <button type="submit">Submit</button>
</form>
