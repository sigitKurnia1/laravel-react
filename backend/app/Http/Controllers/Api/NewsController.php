<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\NewsResource;
use Illuminate\Http\Request;
use App\Models\News;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
{
    public function index()
    {
        $news  = News::latest()->paginate(6);
        
        foreach ($news as $item) {
            $item->image = url('/assets/news/' . $item->image);
            $item->date = Carbon::parse($item->date)->translatedFormat('d F Y');
        }

        return new NewsResource(true, "News Data", $news);
    }

    public function show($id)
    {
        $news = News::findOrFail($id);

        $news->image = url('/assets/news/' . $news->image);
        $news->date = Carbon::parse($news->date)->translatedFormat('d-m-Y');

        return new NewsResource(true, "News Detail", $news);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg',
            'title' => 'required',
            'date' => 'required',
            'narration' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $news = new News;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . "." . $image->getClientOriginalExtension();
            $image->move('assets/news/', $imageName);
        }

        $news->image = $imageName;
        $news->title = $request->title;
        $news->date = Carbon::createFromFormat('d-m-Y', $request->date);
        $news->narration = $request->narration;

        $news->save();

        if ($news) {
            return new NewsResource(true, "News Created Successfully!", $news);
        } else {
            return new NewsResource(false, "Failed To Create News", null);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'nullable|mimes:png,jpg,jpeg',
            'title' => 'required',
            'date' => 'required',
            'narration' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $news = News::findOrFail($id);

        if ($request->hasFile('image')) {
            $imagePath = public_path('assets/news/' . $news->image);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }

            $image = $request->file('image');
            $imageName = time() . "." . $image->getClientOriginalExtension();
            $image->move('assets/news', $imageName);

            $news->update([
                'image' => $imageName,
                'title' => $request->title,
                'date' => Carbon::createFromFormat('d-m-Y', $request->date),
                'narration' => $request->narration,
            ]);
        } else {
            $news->update([
                'image' => $news->image,
                'title' => $request->title,
                'date' => Carbon::createFromFormat('d-m-Y', $request->date),
                'narration' => $request->narration,
            ]);
        }

        if ($news) {
            return new NewsResource(true, "News Updated Successfully!", $news);
        } else {
            return new NewsResource(false, "Failed To Update News", null);
        }
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);

        $imagePath = public_path('assets/news/' . $news->image);

        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }

        $news->delete();

        if ($news) {
            return new NewsResource(true, "News Deleted Successfully!", null);
        } else {
            return new NewsResource(false, "Failed To Delete News", null);
        }
    }
}
