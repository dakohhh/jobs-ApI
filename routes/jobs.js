const router = require('express').Router()


const {
    getAlljobs,
    getJob,
    createJob,
    UpdateJob,
    deleteJob} = require('../controllers/jobs')



    router.route('/').get(getAlljobs).post(createJob)
    router.route('/:id').get(getJob).patch(UpdateJob).delete(deleteJob)




module.exports = router