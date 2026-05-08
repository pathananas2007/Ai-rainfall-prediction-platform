from flask import Blueprint, request, jsonify
from backend.services.predict_service import PredictService
from flask_jwt_extended import jwt_required, get_jwt_identity

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('', methods=['POST'])
@jwt_required()
def predict():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    try:
        result = PredictService.predict(user_id, data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@predict_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    try:
        results = PredictService.get_history(user_id)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@predict_bp.route('/history/<prediction_id>', methods=['DELETE'])
@jwt_required()
def delete_history(prediction_id):
    user_id = get_jwt_identity()
    try:
        success = PredictService.delete_history(prediction_id, user_id)
        if success:
            return jsonify({"message": "Prediction deleted"}), 200
        return jsonify({"error": "Prediction not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
