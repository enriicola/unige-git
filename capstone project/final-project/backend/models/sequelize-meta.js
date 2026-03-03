import { DataTypes } from 'sequelize';
import sequelize from '#root/services/sequelize.js';

const SequelizeMeta = sequelize.define(
  'SequelizeMeta',
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: 'sequelize_meta',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: 'sequelize_meta_pkey',
        unique: true,
        fields: [{ name: 'name' }],
      },
    ],
  }
);

export default SequelizeMeta;
