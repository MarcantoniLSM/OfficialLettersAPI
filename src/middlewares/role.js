function allowRoles(...roles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) return res.status(403).json({ message: 'Sem permissão' });
    if (!roles.includes(userRole)) return res.status(403).json({ message: 'Acesso negado' });
    next();
  };
}

module.exports = { allowRoles };
