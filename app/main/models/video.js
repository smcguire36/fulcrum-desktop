'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

class Video {
  static get tableName() {
    return 'videos';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'metadata', column: 'metadata', type: 'json' }, { name: 'filePath', column: 'file_path', type: 'string' }, { name: 'fileSize', column: 'file_size', type: 'integer' }, { name: 'contentType', column: 'content_type', type: 'string' }, { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false }, { name: 'isUploaded', column: 'is_uploaded', type: 'boolean', null: false }, { name: 'isStored', column: 'is_stored', type: 'boolean', null: false }, { name: 'isProcessed', column: 'is_processed', type: 'boolean', null: false }, { name: 'formRowID', column: 'form_id', type: 'integer' }, { name: 'formID', column: 'form_resource_id', type: 'string' }, { name: 'recordRowID', column: 'record_id', type: 'integer' }, { name: 'recordID', column: 'record_resource_id', type: 'string' }, { name: 'updatedByRowID', column: 'updated_by_id', type: 'integer' }, { name: 'updatedByID', column: 'updated_by_resource_id', type: 'string' }, { name: 'createdByRowID', column: 'created_by_id', type: 'integer' }, { name: 'createdByID', column: 'created_by_resource_id', type: 'string' }, { name: 'hasTrack', column: 'has_track', type: 'boolean' }, { name: 'trackJSON', column: 'track', type: 'json' }, { name: 'width', column: 'width', type: 'integer' }, { name: 'height', column: 'height', type: 'integer' }, { name: 'duration', column: 'duration', type: 'double' }, { name: 'bitRate', column: 'bit_rate', type: 'double' }, { name: 'createdAt', column: 'server_created_at', type: 'datetime' }, { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' }];
  }

  get id() {
    return this._id;
  }

  updateFromAPIAttributes(attributes) {
    this._id = attributes.access_key;
    this._metadata = attributes.metadata;
    this._fileSize = attributes.file_size;
    this._isUploaded = attributes.uploaded;
    this._isStored = attributes.stored;
    this._isProcessed = attributes.processed;
    this._contentType = attributes.content_type;
    this._hasTrack = !!attributes.track;
    this._trackJSON = attributes.track;
    this._createdByID = attributes.created_by_id;
    this._updatedByID = attributes.updated_by_id;
    this._createdAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at);
    this._formID = attributes.form_id;
    this._recordID = attributes.record_id;

    this._width = null;
    this._height = null;
    this._bitRate = null;

    if (attributes.metadata) {
      const video = attributes.metadata && attributes.metadata.streams && attributes.metadata.streams.find(s => s.codec_type === 'video');

      if (video) {
        this._width = video.width;
        this._height = video.height;
      }

      if (attributes.metadata && attributes.metadata.format) {
        if (attributes.metadata.format.duration != null) {
          this._duration = +attributes.metadata.format.duration;
        }

        if (attributes.metadata.format.bit_rate != null) {
          this._bitRate = +attributes.metadata.format.bit_rate;
        }
      }
    }
  }

  get isDownloaded() {
    return this._isDownloaded;
  }

  set isDownloaded(value) {
    this._isDownloaded = !!value;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}

exports.default = Video;
_minidb.PersistentObject.register(Video);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy92aWRlby5qcyJdLCJuYW1lcyI6WyJWaWRlbyIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJpZCIsIl9pZCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImFjY2Vzc19rZXkiLCJfbWV0YWRhdGEiLCJtZXRhZGF0YSIsIl9maWxlU2l6ZSIsImZpbGVfc2l6ZSIsIl9pc1VwbG9hZGVkIiwidXBsb2FkZWQiLCJfaXNTdG9yZWQiLCJzdG9yZWQiLCJfaXNQcm9jZXNzZWQiLCJwcm9jZXNzZWQiLCJfY29udGVudFR5cGUiLCJjb250ZW50X3R5cGUiLCJfaGFzVHJhY2siLCJ0cmFjayIsIl90cmFja0pTT04iLCJfY3JlYXRlZEJ5SUQiLCJjcmVhdGVkX2J5X2lkIiwiX3VwZGF0ZWRCeUlEIiwidXBkYXRlZF9ieV9pZCIsIl9jcmVhdGVkQXQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsImNyZWF0ZWRfYXQiLCJfdXBkYXRlZEF0IiwidXBkYXRlZF9hdCIsIl9mb3JtSUQiLCJmb3JtX2lkIiwiX3JlY29yZElEIiwicmVjb3JkX2lkIiwiX3dpZHRoIiwiX2hlaWdodCIsIl9iaXRSYXRlIiwidmlkZW8iLCJzdHJlYW1zIiwiZmluZCIsInMiLCJjb2RlY190eXBlIiwid2lkdGgiLCJoZWlnaHQiLCJmb3JtYXQiLCJkdXJhdGlvbiIsIl9kdXJhdGlvbiIsImJpdF9yYXRlIiwiaXNEb3dubG9hZGVkIiwiX2lzRG93bmxvYWRlZCIsInZhbHVlIiwiY3JlYXRlZEF0IiwidXBkYXRlZEF0IiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUVlLE1BQU1BLEtBQU4sQ0FBWTtBQUN6QixhQUFXQyxTQUFYLEdBQXVCO0FBQ3JCLFdBQU8sUUFBUDtBQUNEOztBQUVELGFBQVdDLE9BQVgsR0FBcUI7QUFDbkIsV0FBTyxDQUNMLEVBQUVD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LEVBQVc7QUFDVCxhQUFLSCxNQUFMLEdBQWNHLE1BQU1LLEtBQXBCO0FBQ0EsYUFBS1AsT0FBTCxHQUFlRSxNQUFNTSxNQUFyQjtBQUNEOztBQUVELFVBQUl2QyxXQUFXRyxRQUFYLElBQXVCSCxXQUFXRyxRQUFYLENBQW9CcUMsTUFBL0MsRUFBdUQ7QUFDckQsWUFBSXhDLFdBQVdHLFFBQVgsQ0FBb0JxQyxNQUFwQixDQUEyQkMsUUFBM0IsSUFBdUMsSUFBM0MsRUFBaUQ7QUFDL0MsZUFBS0MsU0FBTCxHQUFpQixDQUFDMUMsV0FBV0csUUFBWCxDQUFvQnFDLE1BQXBCLENBQTJCQyxRQUE3QztBQUNEOztBQUVELFlBQUl6QyxXQUFXRyxRQUFYLENBQW9CcUMsTUFBcEIsQ0FBMkJHLFFBQTNCLElBQXVDLElBQTNDLEVBQWlEO0FBQy9DLGVBQUtYLFFBQUwsR0FBZ0IsQ0FBQ2hDLFdBQVdHLFFBQVgsQ0FBb0JxQyxNQUFwQixDQUEyQkcsUUFBNUM7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxNQUFJQyxZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sS0FBS0MsYUFBWjtBQUNEOztBQUVELE1BQUlELFlBQUosQ0FBaUJFLEtBQWpCLEVBQXdCO0FBQ3RCLFNBQUtELGFBQUwsR0FBcUIsQ0FBQyxDQUFDQyxLQUF2QjtBQUNEOztBQUVELE1BQUlDLFNBQUosR0FBZ0I7QUFDZCxXQUFPLEtBQUsxQixVQUFaO0FBQ0Q7O0FBRUQsTUFBSTJCLFNBQUosR0FBZ0I7QUFDZCxXQUFPLEtBQUt4QixVQUFaO0FBQ0Q7QUEvRndCOztrQkFBTmxDLEs7QUFrR3JCLHlCQUFpQjJELFFBQWpCLENBQTBCM0QsS0FBMUIiLCJmaWxlIjoidmlkZW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcclxuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZGVvIHtcclxuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcclxuICAgIHJldHVybiAndmlkZW9zJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgY29sdW1ucygpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXHJcbiAgICAgIHsgbmFtZTogJ2lkJywgY29sdW1uOiAncmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnbWV0YWRhdGEnLCBjb2x1bW46ICdtZXRhZGF0YScsIHR5cGU6ICdqc29uJyB9LFxyXG4gICAgICB7IG5hbWU6ICdmaWxlUGF0aCcsIGNvbHVtbjogJ2ZpbGVfcGF0aCcsIHR5cGU6ICdzdHJpbmcnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2ZpbGVTaXplJywgY29sdW1uOiAnZmlsZV9zaXplJywgdHlwZTogJ2ludGVnZXInIH0sXHJcbiAgICAgIHsgbmFtZTogJ2NvbnRlbnRUeXBlJywgY29sdW1uOiAnY29udGVudF90eXBlJywgdHlwZTogJ3N0cmluZycgfSxcclxuICAgICAgeyBuYW1lOiAnaXNEb3dubG9hZGVkJywgY29sdW1uOiAnaXNfZG93bmxvYWRlZCcsIHR5cGU6ICdib29sZWFuJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnaXNVcGxvYWRlZCcsIGNvbHVtbjogJ2lzX3VwbG9hZGVkJywgdHlwZTogJ2Jvb2xlYW4nLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICdpc1N0b3JlZCcsIGNvbHVtbjogJ2lzX3N0b3JlZCcsIHR5cGU6ICdib29sZWFuJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnaXNQcm9jZXNzZWQnLCBjb2x1bW46ICdpc19wcm9jZXNzZWQnLCB0eXBlOiAnYm9vbGVhbicsIG51bGw6IGZhbHNlIH0sXHJcbiAgICAgIHsgbmFtZTogJ2Zvcm1Sb3dJRCcsIGNvbHVtbjogJ2Zvcm1faWQnLCB0eXBlOiAnaW50ZWdlcicgfSxcclxuICAgICAgeyBuYW1lOiAnZm9ybUlEJywgY29sdW1uOiAnZm9ybV9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnIH0sXHJcbiAgICAgIHsgbmFtZTogJ3JlY29yZFJvd0lEJywgY29sdW1uOiAncmVjb3JkX2lkJywgdHlwZTogJ2ludGVnZXInIH0sXHJcbiAgICAgIHsgbmFtZTogJ3JlY29yZElEJywgY29sdW1uOiAncmVjb3JkX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycgfSxcclxuICAgICAgeyBuYW1lOiAndXBkYXRlZEJ5Um93SUQnLCBjb2x1bW46ICd1cGRhdGVkX2J5X2lkJywgdHlwZTogJ2ludGVnZXInIH0sXHJcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRCeUlEJywgY29sdW1uOiAndXBkYXRlZF9ieV9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2NyZWF0ZWRCeVJvd0lEJywgY29sdW1uOiAnY3JlYXRlZF9ieV9pZCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxyXG4gICAgICB7IG5hbWU6ICdjcmVhdGVkQnlJRCcsIGNvbHVtbjogJ2NyZWF0ZWRfYnlfcmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJyB9LFxyXG4gICAgICB7IG5hbWU6ICdoYXNUcmFjaycsIGNvbHVtbjogJ2hhc190cmFjaycsIHR5cGU6ICdib29sZWFuJyB9LFxyXG4gICAgICB7IG5hbWU6ICd0cmFja0pTT04nLCBjb2x1bW46ICd0cmFjaycsIHR5cGU6ICdqc29uJyB9LFxyXG4gICAgICB7IG5hbWU6ICd3aWR0aCcsIGNvbHVtbjogJ3dpZHRoJywgdHlwZTogJ2ludGVnZXInIH0sXHJcbiAgICAgIHsgbmFtZTogJ2hlaWdodCcsIGNvbHVtbjogJ2hlaWdodCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxyXG4gICAgICB7IG5hbWU6ICdkdXJhdGlvbicsIGNvbHVtbjogJ2R1cmF0aW9uJywgdHlwZTogJ2RvdWJsZScgfSxcclxuICAgICAgeyBuYW1lOiAnYml0UmF0ZScsIGNvbHVtbjogJ2JpdF9yYXRlJywgdHlwZTogJ2RvdWJsZScgfSxcclxuICAgICAgeyBuYW1lOiAnY3JlYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX2NyZWF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXHJcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRBdCcsIGNvbHVtbjogJ3NlcnZlcl91cGRhdGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9XHJcbiAgICBdO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGlkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lkO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xyXG4gICAgdGhpcy5faWQgPSBhdHRyaWJ1dGVzLmFjY2Vzc19rZXk7XHJcbiAgICB0aGlzLl9tZXRhZGF0YSA9IGF0dHJpYnV0ZXMubWV0YWRhdGE7XHJcbiAgICB0aGlzLl9maWxlU2l6ZSA9IGF0dHJpYnV0ZXMuZmlsZV9zaXplO1xyXG4gICAgdGhpcy5faXNVcGxvYWRlZCA9IGF0dHJpYnV0ZXMudXBsb2FkZWQ7XHJcbiAgICB0aGlzLl9pc1N0b3JlZCA9IGF0dHJpYnV0ZXMuc3RvcmVkO1xyXG4gICAgdGhpcy5faXNQcm9jZXNzZWQgPSBhdHRyaWJ1dGVzLnByb2Nlc3NlZDtcclxuICAgIHRoaXMuX2NvbnRlbnRUeXBlID0gYXR0cmlidXRlcy5jb250ZW50X3R5cGU7XHJcbiAgICB0aGlzLl9oYXNUcmFjayA9ICEhYXR0cmlidXRlcy50cmFjaztcclxuICAgIHRoaXMuX3RyYWNrSlNPTiA9IGF0dHJpYnV0ZXMudHJhY2s7XHJcbiAgICB0aGlzLl9jcmVhdGVkQnlJRCA9IGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZDtcclxuICAgIHRoaXMuX3VwZGF0ZWRCeUlEID0gYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkO1xyXG4gICAgdGhpcy5fY3JlYXRlZEF0ID0gRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMuY3JlYXRlZF9hdCk7XHJcbiAgICB0aGlzLl91cGRhdGVkQXQgPSBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KTtcclxuICAgIHRoaXMuX2Zvcm1JRCA9IGF0dHJpYnV0ZXMuZm9ybV9pZDtcclxuICAgIHRoaXMuX3JlY29yZElEID0gYXR0cmlidXRlcy5yZWNvcmRfaWQ7XHJcblxyXG4gICAgdGhpcy5fd2lkdGggPSBudWxsO1xyXG4gICAgdGhpcy5faGVpZ2h0ID0gbnVsbDtcclxuICAgIHRoaXMuX2JpdFJhdGUgPSBudWxsO1xyXG5cclxuICAgIGlmIChhdHRyaWJ1dGVzLm1ldGFkYXRhKSB7XHJcbiAgICAgIGNvbnN0IHZpZGVvID0gYXR0cmlidXRlcy5tZXRhZGF0YSAmJiBhdHRyaWJ1dGVzLm1ldGFkYXRhLnN0cmVhbXMgJiYgYXR0cmlidXRlcy5tZXRhZGF0YS5zdHJlYW1zLmZpbmQocyA9PiBzLmNvZGVjX3R5cGUgPT09ICd2aWRlbycpO1xyXG5cclxuICAgICAgaWYgKHZpZGVvKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB2aWRlby53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB2aWRlby5oZWlnaHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChhdHRyaWJ1dGVzLm1ldGFkYXRhICYmIGF0dHJpYnV0ZXMubWV0YWRhdGEuZm9ybWF0KSB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubWV0YWRhdGEuZm9ybWF0LmR1cmF0aW9uICE9IG51bGwpIHtcclxuICAgICAgICAgIHRoaXMuX2R1cmF0aW9uID0gK2F0dHJpYnV0ZXMubWV0YWRhdGEuZm9ybWF0LmR1cmF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMubWV0YWRhdGEuZm9ybWF0LmJpdF9yYXRlICE9IG51bGwpIHtcclxuICAgICAgICAgIHRoaXMuX2JpdFJhdGUgPSArYXR0cmlidXRlcy5tZXRhZGF0YS5mb3JtYXQuYml0X3JhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgaXNEb3dubG9hZGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzRG93bmxvYWRlZDtcclxuICB9XHJcblxyXG4gIHNldCBpc0Rvd25sb2FkZWQodmFsdWUpIHtcclxuICAgIHRoaXMuX2lzRG93bmxvYWRlZCA9ICEhdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgY3JlYXRlZEF0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NyZWF0ZWRBdDtcclxuICB9XHJcblxyXG4gIGdldCB1cGRhdGVkQXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlZEF0O1xyXG4gIH1cclxufVxyXG5cclxuUGVyc2lzdGVudE9iamVjdC5yZWdpc3RlcihWaWRlbyk7XHJcbiJdfQ==