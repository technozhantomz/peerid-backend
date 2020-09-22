const Sequelize = require('sequelize');
const uid = require('uid2');
const {Model} = Sequelize;

class AppModel extends Model {
  getPublic() {
    return {
      id: this.id,
      appname: this.appname,
      contactname: this.contactname,
      description: this.description,
      organization_name: this.organization_name,
      province: this.province,
      city: this.city,
      address_line1: this.address_line1,
      address_line2: this.address_line2,
      postal_code: this.postal_code,
      email: this.email,
      phone: this.phone || '',
      domains: this.domains,
      registrar_id: this.registrar_id
    };
  }
}
const attributes = {
  appname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  organization_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  province: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contactname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address_line1: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address_line2: {
    type: Sequelize.STRING
  },
  postal_code: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  domains: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false
  },
  app_secret: {
    type: Sequelize.STRING,
    unique: true,
    defaultValue: function() {
      return uid(42);
    }
  },
  registrar_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};

module.exports = {
  init: (sequelize) => {
    AppModel.init(attributes, {
      sequelize,
      modelName: 'apps'
    });
  },
  associate: (models) => {
    AppModel.belongsTo(models.User.model, {foreignKey : 'registrar_id', targetKey: 'id', as: 'registrar'});
  },
  get model() {
    return AppModel;
  }
};
