function isMetadataReducer<T>(obj: any): obj is MetadataReducer<T> {
    return typeof(obj) === 'function';
  }
  
  function isMetadataMap<T>(obj: any): obj is MetadataMap<T> {
    return typeof(obj) === 'object';
  }

export function resolveMetadata<T>(entity_id: string, entity: AnyEntity, context: any, metadata: MetadataReducer<T> | MetadataMap<T>) : T {
    
    var result;
    
    if (metadata) {
      if (isMetadataReducer(metadata)) {
          result = metadata(entity_id, entity, context);
      }

      if (isMetadataMap(metadata)) {
          result = metadata[entity?.state];
      }
    }

    return result ?? ({} as T);
}