<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\FoodcafeResource;
use App\Models\FoodCafe;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class FoodcafeController extends Controller
{
    public function index()
    {
        $foodCafe = FoodCafe::latest()->paginate(6);

        foreach ($foodCafe as $item) {
            $item->image = url('/assets/foodcafe/' . $item->image);
            $item->open = Carbon::parse($item->open)->translatedFormat('H:i');
            $item->close = Carbon::parse($item->close)->translatedFormat('H:i');
        }

        return new FoodcafeResource(true, "Data Foodcafe", $foodCafe);
    }

    public function show($id)
    {
        $foodCafe = FoodCafe::findOrFail($id);

        $foodCafe->image = url('/assets/foodcafe/' . $foodCafe->image);
        $foodCafe->open = Carbon::parse($foodCafe->open)->translatedFormat('H:i');
        $foodCafe->close = Carbon::parse($foodCafe->close)->translatedFormat('H:i');

        return new FoodcafeResource(true, "Detail Foodcafe", $foodCafe);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg',
            'name' => 'required',
            'distance' => 'required',
            'open' => 'required',
            'close' => 'required',
            'narration' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $foodCafe = new FoodCafe;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move('assets/foodcafe', $imageName);
            $foodCafe->image = $imageName;
        }
        $foodCafe->name = $request->input('name');
        $foodCafe->distance = $request->input('distance');
        $foodCafe->open = $request->input('open');
        $foodCafe->close = $request->input('close');
        $foodCafe->narration = $request->input('narration');

        $foodCafe->save();

        if ($foodCafe) {
            return new FoodcafeResource(true, "Foodcafe Created Successfully!", $foodCafe);
        } else {
            return new FoodcafeResource(false, "Failed To Create Foodcafe!", null);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'nullable|mimes:png,jpg,jpeg',
            'name' => 'required',
            'distance' => 'required',
            'open' => 'required',
            'close' => 'required',
            'narration' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $foodCafe = FoodCafe::findOrFail($id);

        if ($request->hasFile('image')) {
            $imagePath = public_path('assets/foodcafe/' . $foodCafe->image);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }

            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move('assets/foodcafe', $imageName);
            
            $foodCafe->update([
                'image' => $imageName,
                'name' => $request->name,
                'distance' => $request->distance,
                'open' => $request->open,
                'close' => $request->close,
                'narration' => $request->narration
            ]);
        } else {
            $foodCafe->update([
                'image' => $foodCafe->image,
                'name' => $request->name,
                'distance' => $request->distance,
                'open' => $request->open,
                'close' => $request->close,
                'narration' => $request->narration
            ]);
        }

        if ($foodCafe) {
            return new FoodcafeResource(true, "Foodcafe Updated Successfully!", $foodCafe);
        } else {
            return new FoodcafeResource(false, "Failed To Update Foodcafe", null);
        }
    }

    public function destroy($id)
    {
        $foodCafe = FoodCafe::findOrFail($id);

        $imagePath = public_path('assets/foodcafe/' . $foodCafe->image);

        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }

        $foodCafe->delete();

        if ($foodCafe) {
            return new FoodcafeResource(true, "Foodcafe Deleted Successfully!", null);
        } else {
            return new FoodcafeResource(false, "Failed To Delete Foodcafe", null);
        }
    }
}
