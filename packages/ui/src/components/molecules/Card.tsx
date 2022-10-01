import PropTypes from "prop-types"

const Card = ({ children, className = "" }: any) => (
  <div className={"rounded-xl" + (className && ` ${className}`)}>
    {children}
  </div>
)

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default Card
