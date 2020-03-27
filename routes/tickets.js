const express = require('express');
const router = express.Router();






router.get('/', (req,res) =>{
  res.status(200).json({success:true, data:{} })
});

router.post('/', (req,res) =>{
  res.status(200).json({success:true, data:{} })
});

router.put('/:id', (req,res) =>{
  res.status(200).json({success:true, data:{} })
});

router.delete('/:id', (req,res) =>{
  res.status(200).json({success:true, data:{} })
});


module.exports = router;
