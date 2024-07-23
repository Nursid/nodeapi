const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ComplainModel = sequelize.define('complain', {
          order_no: {
            type: DataTypes.STRING
          },
          user_type: {
            type: DataTypes.STRING
          },
          booktime: {
            type: DataTypes.STRING
          },
          bookdate: {
            type: DataTypes.STRING
          },
          service_name: {
            type: DataTypes.STRING
          },
          city: {
            type: DataTypes.STRING
          },
          service_address: {
            type: DataTypes.STRING
          },
          pincode: {
            type: DataTypes.STRING
          },
          problem_des: {
            type: DataTypes.STRING
          },
          cust_id: {
            type: DataTypes.STRING
          },
          issapproved: {
            type: DataTypes.INTEGER
          },
          suprvisor_id: {
            type: DataTypes.STRING
          },
          servicep_id: {
            type: DataTypes.STRING
          },
          paymethod: {
            type: DataTypes.STRING
          },
          totalamt: {
            type: DataTypes.STRING
          },
          piadamt: {
            type: DataTypes.STRING
          },
          netpayamt: {
            type: DataTypes.STRING
          },
          reservprovider: {
            type: DataTypes.STRING
          },
          review: {
            type: DataTypes.STRING
          },
          admin_approve: {
            type: DataTypes.INTEGER
          },
          pending: {
            type: DataTypes.INTEGER
          },
          cust_remark: {
            type: DataTypes.STRING
          },
          servp_remark: {
            type: DataTypes.STRING
          },
          suerv_remark: {
            type: DataTypes.STRING
          },
          admin_remark: {
            type: DataTypes.STRING
          },
          bakof_remark: {
            type: DataTypes.STRING
          },
          sueadmin_remark: {
            type: DataTypes.STRING
          },
          cancle_reson: {
            type: DataTypes.STRING
          },
          service_status: {
            type: DataTypes.STRING
          },
          reotrans: {
            type: DataTypes.STRING
          },
          checkstatus: {
            type: DataTypes.INTEGER
          },
          checkintime: {
            type: DataTypes.STRING
          },
          checkouttime: {
            type: DataTypes.STRING
          },
          land_mark: {
            type: DataTypes.STRING
          },
          vehicle_inventory: {
            type: DataTypes.INTEGER
          }
        },
         {
        timestamps: true,
        tableName: 'complain',
    });

    return ComplainModel;
};
    